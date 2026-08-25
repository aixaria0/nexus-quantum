import QLF_Axioms
import QLF_Spectral
import Mathlib.Data.Complex.Basic
import Mathlib.LinearAlgebra.Matrix.Hermitian

namespace QLF

open Matrix

/-- The geometric condition for sitting on the null cone. -/
def is_null_spectral (s : TopoString) : Prop := 
  ∃ c : ℂ, toSpectralMode s = c • (1 : Matrix (Fin 2) (Fin 2) ℂ)

lemma toSpectralMode_zero_zero (s : TopoString) : (toSpectralMode s) 0 0 = (count_pos s : ℂ) := by 
  induction s with 
  | nil => rfl 
  | cons hd tl ih => 
    unfold toSpectralMode at * 
    simp only [List.map_cons, List.sum_cons, Matrix.add_apply, ih] 
    rw [count_pos_cons] 
    cases hd with 
    | gauge => rfl 
    | phase p => cases p <;> rfl

lemma pure_zero_count_implies_empty (s : TopoString)
    (h_pure : ∀ e ∈ s, ∃ p, e = TopoElement.phase p) 
    (h_pos_zero : count_pos s = 0) 
    (h_neg_zero : count_neg s = 0) : s = null := by 
  cases s with 
  | nil => rfl 
  | cons hd tl => 
    have ⟨p, hp_eq⟩ := h_pure hd (List.mem_cons_self hd tl) 
    cases p 
    · subst hp_eq 
      rw [count_pos_cons, val_pos] at h_pos_zero 
      omega 
    · subst hp_eq 
      rw [count_neg_cons, val_neg] at h_neg_zero 
      omega

theorem zfa_implies_null_spectral (s : TopoString) 
    (h_not_empty : s ≠ null) 
    (h_pure : ∀ e ∈ s, ∃ p, e = TopoElement.phase p) 
    (h_zfa : achieves_ZFA s) : 
    ∃ c : ℂ, c ≠ 0 ∧ toSpectralMode s = c • (1 : Matrix (Fin 2) (Fin 2) ℂ) := by
  have h_sym : is_symmetric s := zfa_implies_critical_line s h_zfa
  have h_scalar := spectral_symmetric_eq_scalar_id s h_pure h_sym
  rcases h_scalar with ⟨c, hc_eq⟩ 
  use c
  constructor 
  · intro hc_zero
    have h_eval : (toSpectralMode s) 0 0 = (c • (1 : Matrix (Fin 2) (Fin 2) ℂ)) 0 0 := by rw [hc_eq]
    rw [toSpectralMode_zero_zero s, hc_zero] at h_eval
    simp only [zero_smul, Matrix.zero_apply] at h_eval
    have h_pos_zero : count_pos s = 0 := by exact_mod_cast h_eval
    have h_neg_zero : count_neg s = 0 := by 
      unfold is_symmetric at h_sym 
      omega
    have h_empty := pure_zero_count_implies_empty s h_pure h_pos_zero h_neg_zero 
    exact h_not_empty h_empty
  · exact hc_eq

end QLF
